import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider'
import { MatGridListModule } from '@angular/material/grid-list';

const MaterialComponents = [
  MatButtonModule,
  MatRadioModule,
  MatSliderModule,
  MatGridListModule
]

@NgModule({
  imports: [
    MaterialComponents,
  ],
  exports: [
    MaterialComponents,
  ]
})
export class MaterialModule { }
