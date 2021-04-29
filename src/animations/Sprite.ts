export type FrameCoordinates = [number, number];

class Sprite {
  sprite: {
    image: HTMLImageElement;
    width: number;
    height: number;
    columns: number;
    rows: number;
    center: number;
    count: number;
    frames: FrameCoordinates[][];
    frameWidth: number;
    frameHeight: number;
  };
  constructor(
    src: string,
    width: number,
    height: number,
    columns: number,
    rows: number
  ) {
    const image = new Image();
    image.src = src;

    const frameWidth = width / columns;
    const frameHeight = height / rows;

    const frames: FrameCoordinates[][] = [];
    let col: number;
    let row: number;

    for (row = 0; row < rows; row++) {
      frames.push([]);

      for (col = 0; col < columns; col++) {
        frames[row][col] = [col * frameWidth, row * frameHeight];
      }
    }

    this.sprite = {
      image,
      width,
      height,
      columns,
      rows,
      center: frameWidth / 2,
      count: columns,
      frames,
      frameWidth,
      frameHeight,
    };

    this.get = this.get.bind(this);
  }

  get(row = 0) {
    return {
      ...this.sprite,
      frames: this.sprite.frames[row],
    };
  }
}

export default Sprite;
