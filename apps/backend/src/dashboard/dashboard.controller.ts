import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("/venteSemaine")
  async getVenteSemaine(){
    return this.dashboardService.getVenteSemaine();
  }
  
  @Get("/chiffreAffaireSemaine")
  async getChiffreAfaireSemaine(){
    return this.dashboardService.getChiffreAffairesSemaine();
  }

  @Get("/previsionStock")
  async getPrevisionStock(){
    return this.dashboardService.getStockForecast()
  }

  @Get("/previsionStockSES")
  async getPrevisionStockMA(){
    return this.dashboardService.getStockForecastSES()
  }

  @Get("/previsionStockDES")
  async getPrevisionStockDES(){
    return this.dashboardService.getStockForecastDES()
  }



  
  

}
