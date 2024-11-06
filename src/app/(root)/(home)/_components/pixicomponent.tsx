import React, { useEffect } from "react";
import * as PIXI from "./pixi.js";

interface PixiComponentProps {
  imageUrls: string[];
}

const PixiComponent = ({ imageUrls }: PixiComponentProps) => {
  useEffect(() => {
    const app = new PIXI.Application({ width: 800, height: 600 });
    document.getElementById("pixi-container")?.appendChild(app.view);

    // Load and display each image
    imageUrls.forEach((url, index) => {
      const texture = PIXI.Texture.from(url);
      const sprite = new PIXI.Sprite(texture);
      sprite.x = (index % 4) * 200; // Adjust x position
      sprite.y = Math.floor(index / 4) * 200; // Adjust y position
      sprite.width = 150;
      sprite.height = 150;
      app.stage.addChild(sprite);
    });

    return () => app.destroy(true, true);
  }, [imageUrls]);

  return <div id="pixi-container"></div>;
};

export default PixiComponent;
