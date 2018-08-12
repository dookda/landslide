import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import { InputcPage } from '../inputc/inputc';

@IonicPage()
@Component({
  selector: 'page-inputb',
  templateUrl: 'inputb.html',
})
export class InputbPage {
  public reportForm : FormGroup;
  public fbl : FormControl;
  public fbah : FormControl;
  public fbaz : FormControl;

  public e: number;
  public n: number;
  public az: number;
  public hi: number;  
  public bl: number;
  public bah: number;  
  public baz: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fb : FormBuilder
  ) {
    this.e= navParams.get('e');
    this.n= navParams.get('n');
    this.az= navParams.get('az');
    this.hi= navParams.get('hi');
    //form validate
    this.fbl = fb.control('', Validators.required);
    this.fbah = fb.control('', Validators.required);
    this.fbaz = fb.control('', Validators.required);
    this.reportForm = fb.group({
      'bl': this.fbl, 
      'bah': this.fbah, 
      'baz': this.fbaz
    })
  }

  ionViewDidLoad() {
    console.log(this.e);
    console.log(this.n);
    console.log(this.az);
    console.log(this.hi);
  }

  gotoC(){
    this.navCtrl.push(InputcPage, {
      e: this.e,
      n: this.n,
      az: this.az,
      hi: this.hi,
      bl: this.reportForm.controls['bl'].value,
      bah: this.reportForm.controls['bah'].value,
      baz: this.reportForm.controls['baz'].value
    })
  }

}
