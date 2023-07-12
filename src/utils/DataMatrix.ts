
export class DataMatrix<T>{
    rows;
    cols;
    data;
    constructor (rows:number, cols:number) {
        this.rows = rows;
        this.cols = cols;
        this.data = new Array(rows * cols).fill(0);
      }
      getValue(row:number, col:number):T {
        const index = row * this.cols + col;
        return this.data[index];
      }
    
      setValue(row:number, col:number, value:T) {
        const index = row * this.cols + col;
        this.data[index] = value;
      }

}