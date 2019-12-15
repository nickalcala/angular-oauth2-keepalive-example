import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgIdleKeepaliveModule.forRoot(),
        LocalStorageModule.forRoot({
            prefix: 'angular-oauth2-keepalive-example',
            storageType: 'localStorage'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
