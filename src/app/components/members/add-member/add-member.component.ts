import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImageCropperComponent } from '../../image-cropper/image-cropper.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddMemberComponent
    }
  ]
})
export class AddMemberComponent implements OnInit, ControlValueAccessor {
  file: string = '';
  onChange = (fileURL: string) => {};
  onTouched = () => {};
  disabled: boolean = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  writeValue(_file: string): void {
    this.file = _file;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileChange(event: any) {
    // The file selected by the user is available in event.target.files
    const files = event.target.files as FileList;

    if(files.length > 0) {
      //parse the selected file to an ObjectURL, so it can be used as a background-image property
      const _file = URL.createObjectURL(files[0]);
      this.resetInput();
      this.openPhotoEditor(_file).subscribe(
        (result) => {
          if(result) {
            this.file = result;
            this.onChange(this.file);
          }
        }
      )
    }
  }

  openPhotoEditor(image: string) : Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image
    });

    return dialogRef.afterClosed();
  }

  resetInput() {
    const input = document.getElementById('input-image') as HTMLInputElement;
    if(input){
      input.value = "";
    }
  }
}
