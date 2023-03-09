import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { OtherProfileComponent } from './Components/other-profile/other-profile.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tab',
    loadChildren: () => import('./Pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'chats-tab',
    loadChildren: () => import('./Pages/chats-tab/chats-tab.module').then( m => m.ChatsTabPageModule)
  },
  {
    path: 'profile-tab',
    loadChildren: () => import('./Pages/profile-tab/profile-tab.module').then( m => m.ProfileTabPageModule)
  },
  {
    path: 'contact-tab',
    loadChildren: () => import('./Pages/contact-tab/contact-tab.module').then( m => m.ContactTabPageModule)
  },
  {
    path: 'message/:id/:name/:type',
    loadChildren: () => import('./Pages/message/message.module').then( m => m.MessagePageModule)
  },
  {
    path: 'message',
    loadChildren: () => import('./Pages/message/message.module').then( m => m.MessagePageModule)
  },
  {
    path: 'new-chat',
    loadChildren: () => import('./Pages/new-chat/new-chat.module').then( m => m.NewChatPageModule)
  },{
    path: 'profile/:otherId/:type',
    component: OtherProfileComponent
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
