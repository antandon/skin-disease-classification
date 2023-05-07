import React, { useState } from "react";

function Prediction() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePrediction, setImagePrediction] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    const predictionEndpointUrl = "https://skindiseasecustomvisionapi-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/76a4c6fb-6ccc-447e-bd0c-e9f5a4b7bb2b/classify/iterations/Iteration2/image";
    const predictionKey = "2b29132e6e634eb0a73c18030c167d83";
    const requestBody = new FormData();
    requestBody.append("image", imageFile);
    const requestOptions = {
      method: "POST",
      headers: {
        "Prediction-Key": predictionKey
      },
      body: requestBody
    };

    try {
      const response = await fetch(predictionEndpointUrl, requestOptions);
      const predictionData = await response.json();
      setImagePrediction(predictionData.predictions[0].tagName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    setIsClicked(true);
  }

  return (
    <div className="container">
      <div className="selected-image-container">
        {imagePreview && (
          <img className="selected-image" src={imagePreview} alt="Selected" />
        )}
      </div>
      <form onSubmit={handleImageSubmit}>
        <div className="file">
          <label className={isClicked ? "file-label clicked" : "file-label"} onClick={handleButtonClick}>
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label-text">
                Select an image
              </span>
            </span>
            <input className="file-input" type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <button className="button predict-button" type="submit" disabled={!imageFile}>Predict</button>
      </form>
      <div className="prediction-container">
        <p>Prediction: {imagePrediction}</p>
      </div>
    </div>
  );
}

export default Prediction;