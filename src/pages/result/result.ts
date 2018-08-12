import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  public reportForm: FormGroup;
  public fname: FormControl;

  public map: L.map;
  public i: number;
  public e: number;
  public n: number;
  public posA: number[];
  public posB: number[];
  public posC: number[];
  public az: number;
  public hi: number;
  public bl: number;
  public bah: number;
  public baz: number;
  public cl: number;
  public cah: number;
  public caz: number;

  public bls: number;
  public be: number;
  public bn: number;
  public bz: number;
  public cls: number;
  public ce: number;
  public cn: number;
  public cz: number;
  public hcb: number;
  public scb: number;
  public slcb: number;
  public anbc: number;

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private alertCtrl: AlertController,
    public fb: FormBuilder
  ) {

    this.e = navParams.get('e');
    this.n = navParams.get('n');
    this.az = navParams.get('az');
    this.hi = navParams.get('hi');
    this.bl = navParams.get('bl');
    this.bah = navParams.get('bah');
    this.baz = navParams.get('baz');
    this.cl = navParams.get('cl');
    this.cah = navParams.get('cah');
    this.caz = navParams.get('caz');

    this.bah = Number(this.bah) / 57.29578;
    this.baz = Number(this.baz) / 57.29578;
    this.cah = Number(this.cah) / 57.29578;
    this.caz = Number(this.caz) / 57.29578;

    this.bls = this.bl * Math.sin(this.bah);
    this.be = Number(this.e) + (Math.sin(this.baz) * this.bls);
    this.bn = Number(this.n) + (Math.cos(this.baz) * this.bls);
    this.bz = Number(this.az) + (this.bl * Math.cos(this.bah)) - this.hi;
    this.cls = this.cl * Math.sin(this.cah);
    this.ce = Number(this.e) + (Math.sin(this.caz) * this.cls);
    this.cn = Number(this.n) + (Math.cos(this.caz) * this.cls);
    this.cz = Number(this.az) + (this.cl * Math.cos(this.cah)) - this.hi;
    this.hcb = this.cz - this.bz;
    this.scb = this.cls - this.bls;
    this.slcb = this.hcb / this.scb * 100;

    this.anbc = Math.atan(this.slcb / 100) * 57.2957895;

    //form validate
    this.fname = fb.control('', Validators.required);
    this.reportForm = fb.group({
      'fname': this.fname
    })
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'กำลังวิเคราะห์...'
    });
    loading.present();

    this.calSlope();
    //this.loadMap();

    setTimeout(() => {
      this.i = this.i + 10;
      this.loadMap();
      loading.dismiss();
    }, 1000);
  }

  calSlope() {

    this.http.get('http://cgi.uru.ac.th/service/convert_utm2latlon.php?e=' + Number(this.e) + '&n=' + Number(this.n))
      .subscribe(res => {
        this.posA = [Number(res[0].lat), Number(res[0].lon)];
      });

    this.http.get('http://cgi.uru.ac.th/service/convert_utm2latlon.php?e=' + Number(this.be) + '&n=' + Number(this.bn))
      .subscribe(res => {
        this.posB = [Number(res[0].lat), Number(res[0].lon)];
      });

    this.http.get('http://cgi.uru.ac.th/service/convert_utm2latlon.php?e=' + Number(this.ce) + '&n=' + Number(this.cn))
      .subscribe(res => {
        this.posC = [Number(res[0].lat), Number(res[0].lon)];
      });
  }

  loadMap() {
    this.map = L.map('map2', {
      //center: this.posA,
      //zoom: 16
    });
    //this.map.setView(this.posA, 16);

    let osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'OSM'
    });

    let mapbox = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    // const rIcon = L.icon({iconUrl: 'assets/icon/map-marker-point-r.png',shadowUrl:'assets/icon/map-marker-point-s.png',iconSize:[50, 50],shadowSize: [50, 50]});
    // const gIcon = L.icon({iconUrl: 'assets/icon/map-marker-point-g.png',shadowUrl:'assets/icon/map-marker-point-s.png',iconSize:[50, 50],shadowSize: [50, 50]});
    // const bIcon = L.icon({iconUrl: 'assets/icon/map-marker-point-b.png',shadowUrl:'assets/icon/map-marker-point-s.png',iconSize:[50, 50],shadowSize: [50, 50]});

    let markerA = L.marker(this.posA, { draggable: false }).addTo(this.map).bindPopup("จุด A").openPopup();
    let markerB = L.marker(this.posB, { draggable: false }).addTo(this.map).bindPopup("จุด B");
    let markerC = L.marker(this.posC, { draggable: false }).addTo(this.map).bindPopup("จุด C");

    let poly = L.polygon([this.posA, this.posB, this.posC]).addTo(this.map);

    let group = new L.featureGroup([markerA, markerB, markerC]);

    this.map.fitBounds(group.getBounds());

    let baseLayers = {
      "Google Maps": mapbox,
      "OpenStreetMap": osm
    };

    let overlays = {
      "markerA": markerA,
      "markerB": markerB,
      "markerC": markerC,
      "แนวเล็ง": poly
    };
    L.control.layers(baseLayers, overlays).addTo(this.map);
  }

  send2Database() {
    let loading = this.loadingCtrl.create({
      content: 'กำลังส่งข้อมูล...'
    });
    loading.present();

    let data = JSON.stringify({
      "fname": this.reportForm.controls['fname'].value,
      "alat": this.posA[0],
      "alon": this.posA[1],
      "ae": this.e,
      "an": this.n,
      "az": this.az,
      "hi": this.hi,
      "blat": this.posB[0],
      "blon": this.posB[1],
      "bl": this.bl,
      "bah": this.bah,
      "baz": this.baz,
      "clat": this.posC[0],
      "clon": this.posC[1],
      "cl": this.cl,
      "cah": this.cah,
      "caz": this.caz,
      "bls": this.bls,
      "bn": this.bn,
      "bz": this.bz,
      "cls": this.cls,
      "ce": this.ce,
      "cn": this.cn,
      "cz": this.cz,
      "hcb": this.hcb,
      "scb": this.scb,
      "slcb": this.slcb,
      "anbc": this.anbc
    });

    this.http.post('http://cgi.uru.ac.th/service/disaster_landslide.php', data)
      .subscribe(res => {
        loading.dismiss();

        let alert = this.alertCtrl.create({
          title: 'ส่งข้อมูลสำเร็จ!',
          subTitle: 'ข้อมูลถูกจัดเก็บแล้ว ท่านต้องการเริ่มต้นใหม่หรือไม่ ?',
          buttons: [
            {
              text: 'ไม่ต้องการ',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'ต้องการ',
              handler: () => {
                this.gotoHome();
              }
            }
          ],
          //cssClass: 'alertDanger'
        });
        alert.present();

      }, error => {
        console.log("Oooops!");
        loading.dismiss();
      });
  }

  gotoHome() {
    this.navCtrl.setRoot(HomePage, {

    }
    )
  }


}
