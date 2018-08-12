import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import { ResultPage } from '../result/result';

@IonicPage()
@Component({
  selector: 'page-inputc',
  templateUrl: 'inputc.html',
})
export class InputcPage {
  public reportForm : FormGroup;
  public fcl : FormControl;
  public fcah : FormControl;
  public fcaz : FormControl;

  public e: number;
  public n: number;
  public az: number;
  public hi: number;  
  public bl: number;
  public bah: number;  
  public baz: number;  
  public cl: number;
  public cah: number;  
  public caz: number;
  

  constructor(
    public modalCtrl : ModalController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fb : FormBuilder
  ) {
    this.e= navParams.get('e');
    this.n= navParams.get('n');
    this.az= navParams.get('az');
    this.hi= navParams.get('hi');
    this.bl= navParams.get('bl');
    this.bah= navParams.get('bah');
    this.baz= navParams.get('baz');
    //form validate
    this.fcl = fb.control('', Validators.required);
    this.fcah = fb.control('', Validators.required);
    this.fcaz = fb.control('', Validators.required);
    this.reportForm = fb.group({
      'cl': this.fcl, 
      'cah': this.fcah, 
      'caz': this.fcaz
    })
  }

  ionViewDidLoad() {
    console.log(this.e);
    console.log(this.az);
    console.log(this.hi);
    console.log(this.bl);
    console.log(this.bah);
    console.log(this.baz);
  }

  gotoResult(){
   this.navCtrl.push(ResultPage, {
      e: this.e,
      n: this.n,
      az: this.az,
      hi: this.hi,
      bl: this.bl,
      bah: this.bah,
      baz: this.baz,
      cl: this.reportForm.controls['cl'].value,
      cah: this.reportForm.controls['cah'].value,
      caz: this.reportForm.controls['caz'].value
    })
  }

}
