export enum TOAST_TYPES {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning'
}

export enum MODALCSS {
    CENTER = 'modal-dialog-centered',
    DEFAULT_SMALL ='flexModal modal-dialog modal-sm d-flex justify-content-center modal-dialog-centered'
}

export interface initialState {
  title:string,
  msg:string,
  popUpType:string,
  data:any
}