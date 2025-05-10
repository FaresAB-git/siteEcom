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
}
