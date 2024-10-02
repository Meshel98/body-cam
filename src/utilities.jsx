// utilities.js
export const drawRect = (detections, ctx, videoWidth, videoHeight) => {
  detections.forEach((prediction) => {
    if (prediction.class === "person") {
      // Get prediction results and scale to video dimensions
      const [x, y, width, height] = [
        (prediction.bbox[0] / videoWidth) * ctx.canvas.width,
        (prediction.bbox[1] / videoHeight) * ctx.canvas.height,
        (prediction.bbox[2] / videoWidth) * ctx.canvas.width,
        (prediction.bbox[3] / videoHeight) * ctx.canvas.height,
      ];
      const text = prediction.class;

      // Set styling
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.fillStyle = "red";
      ctx.font = "18px Arial";

      // Draw rectangle and text
      ctx.beginPath();
      ctx.fillText(text, x, y - 10);
      ctx.rect(x, y, width, height);
      ctx.stroke();
    }
  });
};
