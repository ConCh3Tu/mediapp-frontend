import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignoService } from './../../_service/signo.service';
import { Signo } from './../../_model/signo';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idSigno', 'paciente', 'pulso', 'ritmoRespiratorio', 'temperatura', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(
    private signoService: SignoService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    //Solo cuando se hace next()
    this.signoService.signoCambio.subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

    this.signoService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });




    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    })


  } 

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  
  eliminar(idSigno: number) {
    this.signoService.eliminar(idSigno).subscribe(() => {
      this.signoService.listarPageable(0,10).subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }

  mostrarMas(e: any) {
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
}
