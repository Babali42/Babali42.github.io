import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TechnoComponent} from './pages/techno/techno.component';
import {MetalComponent} from './pages/metal/metal.component';
import {provideRouter} from '@angular/router';
import {routes} from '../app.route';
import {EbmComponent} from './pages/ebm/ebm.component';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {GabberComponent} from './pages/gabber/gabber.component';
import {HttpClientModule} from "@angular/common/http";
import { TrackComponent } from './components/sequencer/track/track.component';
import { RockComponent } from './pages/rock/rock.component';
import { RockVariationComponent } from './pages/rock-variation/rock-variation.component';
import { HalfTimeGrooveComponent } from './pages/half-time-groove/half-time-groove.component';

@NgModule({
  declarations: [
    AppComponent,
    TechnoComponent,
    MetalComponent,
    EbmComponent,
    SequencerComponent,
    GabberComponent,
    TrackComponent,
    RockComponent,
    RockVariationComponent,
    HalfTimeGrooveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [provideRouter(routes)],
  bootstrap: [AppComponent]
})
export class AppModule {
}