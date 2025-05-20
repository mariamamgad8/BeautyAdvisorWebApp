import cv2
import numpy as np
import mediapipe as mp
from PIL import Image
import json
import os
import sys

# Initialize face mesh
mp_face_mesh = mp.solutions.face_mesh

def extract_features(image_path):
    """
    Extract facial features from an image.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary containing face shape, skin tone, eye color, hair color, and hair texture
    """
    try:
        image = cv2.imread(image_path)
        if image is None:
            return {"error": "Could not read image"}
            
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        h, w, _ = image.shape

        with mp_face_mesh.FaceMesh(static_image_mode=True) as face_mesh:
            result = face_mesh.process(image_rgb)
            if not result.multi_face_landmarks:
                return {"error": "No face detected"}

            landmarks = result.multi_face_landmarks[0].landmark

            # -------------------- FACE SHAPE --------------------
            jaw = [landmarks[i] for i in range(0, 17)]
            jaw_width = np.linalg.norm(np.array([jaw[0].x, jaw[0].y]) - np.array([jaw[-1].x, jaw[-1].y]))
            face_height = np.linalg.norm(np.array([landmarks[10].x, landmarks[10].y]) - np.array([landmarks[152].x, landmarks[152].y]))
            ratio = jaw_width / face_height
            if ratio < 0.85:
                face_shape = "Oval"
            elif 0.85 <= ratio < 1.05:
                face_shape = "Round"
            else:
                face_shape = "Square"

            # -------------------- SKIN TONE --------------------
            points = [(int(l.x * w), int(l.y * h)) for l in landmarks]
            cheeks = [points[234], points[454], points[93], points[323]]
            sample_pixels = []
            for x, y in cheeks:
                if 0 <= x < w and 0 <= y < h:
                    sample_pixels.append(image[y, x])
            if sample_pixels:
                avg_skin = np.mean(sample_pixels, axis=0).astype(int).tolist()
            else:
                avg_skin = None

            # -------------------- EYE COLOR --------------------
            left_eye_indices = [33, 133, 160, 159]
            right_eye_indices = [362, 263, 387, 386]
            eye_pixels = []

            for idxs in [left_eye_indices, right_eye_indices]:
                eye_pts = [(int(landmarks[i].x * w), int(landmarks[i].y * h)) for i in idxs]
                x_coords = [x for x, y in eye_pts]
                y_coords = [y for x, y in eye_pts]
                if x_coords and y_coords:
                    x1, x2 = min(x_coords), max(x_coords)
                    y1, y2 = min(y_coords), max(y_coords)
                    eye_crop = image[y1:y2, x1:x2]
                    if eye_crop.size > 0:
                        eye_pixels.append(np.mean(eye_crop.reshape(-1, 3), axis=0))

            if eye_pixels:
                eye_color = np.mean(eye_pixels, axis=0).astype(int).tolist()
            else:
                eye_color = None

            # -------------------- HAIR COLOR & TEXTURE --------------------
            hair_region = image[0:int(h * 0.15), int(w * 0.3):int(w * 0.7)]
            if hair_region.size > 0:
                hair_pixels = hair_region.reshape(-1, 3)
                avg_hair_color = np.mean(hair_pixels, axis=0).astype(int).tolist()
                
                # Estimate texture by sharpness
                gray_hair = cv2.cvtColor(hair_region, cv2.COLOR_BGR2GRAY)
                laplacian_var = cv2.Laplacian(gray_hair, cv2.CV_64F).var()
                if laplacian_var > 150:
                    hair_texture = "Curly or Coarse"
                elif laplacian_var > 50:
                    hair_texture = "Wavy or Slightly Curly"
                else:
                    hair_texture = "Straight or Smooth"
            else:
                avg_hair_color = None
                hair_texture = None

            return {
                "face_shape": face_shape,
                "skin_tone_rgb": avg_skin,
                "eye_color_rgb": eye_color,
                "hair_color_rgb": avg_hair_color,
                "hair_texture": hair_texture
            }
            
    except Exception as e:
        return {"error": f"Processing error: {str(e)}"}


def generate_recommendations(data):
    """
    Generate beauty recommendations based on facial features.
    
    Args:
        data: Dictionary containing face shape, skin tone, eye color, hair color, and hair texture
        
    Returns:
        Dictionary containing makeup and hair style recommendations
    """
    recommendations = {}

    # --- Makeup Style ---
    skin_rgb = data["skin_tone_rgb"]
    face_shape = data["face_shape"]
    eye_rgb = data["eye_color_rgb"]

    if skin_rgb[0] < 120:
        recommendations["makeup"] = "Use warm foundation shades, peach or coral blush, and nude or copper eyeshadow."
    else:
        recommendations["makeup"] = "Go with neutral or cool-toned foundation, rose blush, and light pink or grey eyeshadow."

    if eye_rgb[2] > 100:  # bluish
        recommendations["makeup"] += " Highlight blue eyes with brown or bronze tones."
    elif eye_rgb[1] > 100:  # green/hazel
        recommendations["makeup"] += " Use purple or warm brown eyeshadows for contrast."
    else:
        recommendations["makeup"] += " Try gold, olive, or navy eyeshadow to make brown eyes pop."

    # --- Hair Style ---
    hair_texture = data["hair_texture"]

    if face_shape == "Round":
        recommendations["hair_style"] = "Long layers or volume at the crown to elongate the face."
    elif face_shape == "Oval":
        recommendations["hair_style"] = "Most styles work well — try waves, layered bobs, or curtain bangs."
    elif face_shape == "Square":
        recommendations["hair_style"] = "Soft layers and waves to soften jawline."
    elif face_shape == "Heart":
        recommendations["hair_style"] = "Chin-length bobs or side-swept bangs work best."
    else:
        recommendations["hair_style"] = "Try side parts and gentle waves for balance."

    if "Curly" in hair_texture:
        recommendations["hair_style"] += " Embrace your curls with curl-defining products or try a curly shag cut."
    elif "Straight" in hair_texture:
        recommendations["hair_style"] += " Consider long layers or curtain bangs for volume."
    
    return recommendations


def save_features_to_json(features, output_path="face_attributes.json"):
    """
    Save extracted features to a JSON file.
    
    Args:
        features: Dictionary of facial features
        output_path: Path to save the JSON file
    """
    with open(output_path, "w") as f:
        json.dump(features, f, indent=4)
    return output_path


def process_image(image_path, output_path="face_attributes.json"):
    """
    Process an image and generate beauty recommendations.
    
    Args:
        image_path: Path to the image file
        output_path: Path to save the JSON file with facial features
        
    Returns:
        Dictionary containing recommendations
    """
    # Extract features from the image
    features = extract_features(image_path)
    
    if "error" in features:
        return {"error": features["error"]}
    
    # Save features to JSON
    save_features_to_json(features, output_path)
    
    # Generate recommendations based on the features
    recommendations = generate_recommendations(features)
    
    return {
        "features": features,
        "recommendations": recommendations
    }


# If the script is run directly, process the image provided as an argument
if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        output_path = sys.argv[2] if len(sys.argv) > 2 else "face_attributes.json"
        results = process_image(image_path, output_path)
        print(json.dumps(results, indent=4))
    else:
        print("Usage: python beauty_advisor_model.py <image_path> [output_path]")
