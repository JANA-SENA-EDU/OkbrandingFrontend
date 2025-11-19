 import { Routes } from '@angular/router';                                                                                
  import { authGuard } from './auth/guards/auth.guard';                                                                    
                                                                                                                           
  export const routes: Routes = [                                                                                          
    {                                                                                                                      
      path: 'admin',                                                                                                       
      canActivate: [authGuard],                                                                                            
      loadChildren: () =>                                                                                                  
        import('./admin/admin.routes').then((m) => m.adminRoutes),                                                         
    },                                                                                                                     
    {                                                                                                                      
      path: '',                                                                                                            
      loadChildren: () =>                                                                                                  
        import('./client/client.routes').then((m) => m.clientRoutes),                                                      
    },                                                                                                                     
    { path: '**', redirectTo: '' },                                                                                        
  ];