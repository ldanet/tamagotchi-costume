export type FrameCoordinates = { x: number; y: number };

export type FrameSelection = readonly [number, number];

class Sprite<FrameMap extends { [key: string]: FrameSelection } = {}> {
  sprite: {
    image: HTMLImageElement;
    width: number;
    height: number;
    columns: number;
    rows: number;
    center: number;
    count: number;
    framesCoord: FrameCoordinates[][];
    frameWidth: number;
    frameHeight: number;
    frames: FrameMap;
  };
  constructor(
    src: string,
    width: number,
    height: number,
    columns: number,
    rows: number,
    frames: FrameMap = {} as FrameMap
  ) {
    const image = new Image();
    image.src = src;

    const frameWidth = width / columns;
    const frameHeight = height / rows;

    const framesCoord: FrameCoordinates[][] = [];
    let col: number;
    let row: number;

    for (row = 0; row < rows; row++) {
      framesCoord.push([]);

      for (col = 0; col < columns; col++) {
        framesCoord[row][col] = { x: col * frameWidth, y: row * frameHeight };
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
      framesCoord,
      frameWidth,
      frameHeight,
      frames,
    };

    this.get = this.get.bind(this);
  }

  get(column = 0, row = 0) {
    return {
      ...this.sprite,
      coord: this.sprite.framesCoord[row][column],
    };
  }
}

export default Sprite;
