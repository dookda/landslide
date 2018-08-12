import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import L from 'leaflet';
import { HttpClient } from '@angular/common/http';

import { InputbPage } from '../inputb/inputb';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public reportForm: FormGroup;
  public e: number;
  public n: number;
  public faz: FormControl;
  public fhi: FormControl;

  public map: L.map;
  public marker: L.marker;
  public pos: number[];
  public altitude: number;

  private osm: any;
  private roads: any;
  private satellite: any;
  private hybrid: any;
  private terrain: any;

  private b: any;
  private slope: any;

  constructor(
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    public navCtrl: NavController,
    public fb: FormBuilder,
    public http: HttpClient
    //public navParams: NavParams
  ) {
    this.faz = fb.control('', Validators.required);
    this.fhi = fb.control('', Validators.required);
    this.reportForm = fb.group({
      'az': this.faz,
      'hi': this.fhi
    })

  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map', {
      //center: [13.00, 101.50],
      zoom: 5
    })

    this.osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'OSM'
    });

    // let mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access' +
    //   '_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzs' +
    //   'dDXD2lMJpTfCVsVuA').addTo(this.map);

    // h = roads only; m = standard roadmap; p = terrain; r = somehow altered roadmap; s = satellite only; t = terrain only; y = hybrid;

    this.roads = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.terrain = L.tileLayer('http://{s}.google.com/vt/lyrs=m,t&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    this.b = L.tileLayer.wms('http://cgi.uru.ac.th/gs-disaster/disaster/wms?', {
      layers: 'disaster:landslide_b',
      format: 'image/png',
      zIndex: 5,
      transparent: true
    })

    this.slope = L.tileLayer.wms('http://cgi.uru.ac.th/gs-disaster/disaster/wms?', {
      layers: 'disaster:landslide_slope',
      format: 'image/png',
      zIndex: 5,
      transparent: true
    })

    let baseLayers = {
      "แผนที่ถนน": this.roads,
      "แผนดาวเทียม": this.satellite,
      "แผนที่ผสม": this.hybrid,
      "แผนที่ภูมิประเทศ": this.terrain.addTo(this.map),
      "OpenStreetMap": this.osm
    };

    let overlays = {
      "จุดรังวัดดินถล่ม": this.b.addTo(this.map),
      // "slope": this.slope.addTo(this.map),
      //"dengue": dengue
    };
    L.control.layers(baseLayers, overlays).addTo(this.map);
    this.showLocation();
  }

  showLocation() {
    let loading = this.loadingCtrl.create({
      content: 'กำลังค้นหาตำแหน่ง...'
    });
    loading.present();

    this.geolocation.getCurrentPosition().then((res) => {
      this.http.get('http://cgi.uru.ac.th/service/convert_latlon2utm.php?lon=' + res.coords.longitude + '&lat=' + res.coords.latitude)
        .subscribe(res => {
          this.e = res[0].e;
          this.n = res[0].n;
        }, error => {
          console.log("Oooops!");
        });
      this.altitude = res.coords.altitude;
      this.pos = [res.coords.latitude, res.coords.longitude];
      this.map.setView(this.pos, 16);
      this.marker = L.marker(this.pos, { draggable: true }).addTo(this.map).bindPopup("ตำแหน่งของคุณ").openPopup();
      loading.dismiss();
      this.marker.on("dragend", function (e) {
        this.pos = [e.target._latlng.lat, e.target._latlng.lng];
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.geolocation.watchPosition().subscribe((res) => {
      this.http.get('http://cgi.uru.ac.th/service/convert_latlon2utm.php?lon=' + res.coords.longitude + '&lat=' + res.coords.latitude)
        .subscribe(res => {
          this.e = res[0].e;
          this.n = res[0].n;
        }, error => {
          console.log("Oooops!");
        });

      if (this.marker != undefined) {
        this.map.removeLayer(this.marker);
      };

      this.altitude = res.coords.altitude;
      this.pos = [res.coords.latitude, res.coords.longitude];
      this.map.setView(this.pos, 16);
      this.marker = L.marker(this.pos, { draggable: true }).addTo(this.map).bindPopup("ตำแหน่งของคุณ").openPopup();
      // loading.dismiss();
      this.marker.on("dragend", function (e) {
        this.pos = [e.target._latlng.lat, e.target._latlng.lng];
      });
    });
  }

  gotoB() {
    this.navCtrl.push(InputbPage, {
      e: this.e,
      n: this.n,
      //xy: this.pos[0],
      az: this.reportForm.controls['az'].value,
      hi: this.reportForm.controls['hi'].value
    })
  }

}
