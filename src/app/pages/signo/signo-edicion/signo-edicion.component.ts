import { Signo } from './../../../_model/signo';
import { map, switchMap } from 'rxjs/operators';
import { PacienteService } from './../../../_service/paciente.service';
import { Observable } from 'rxjs';
import { Paciente } from './../../../_model/paciente';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SignoService } from './../../../_service/signo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;  
  pacientes: Paciente[] = [];
  signos: Signo[] = [];
  mensaje: string;

  edicion: boolean = false; 

   pacienteSeleccionado: Paciente;

   fechaSeleccionada: Date = new Date();
   maxFecha: Date = new Date();


  //utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();

  pacientesFiltrados: Observable<Paciente[]>;

  constructor(
    private pacienteService: PacienteService,
    private signoService: SignoService,
    private route: ActivatedRoute,
    private router: Router,
    
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl(new Date()),
      'temperatura': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'pulso': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'ritmoRespiratorio': new FormControl('', [Validators.required, Validators.minLength(3)])
    });


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

    this.listarPacientes();
  
    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  initForm() {
    
    
    if (this.edicion) {

      this.signoService.listarPorId(this.id).subscribe(data => {

        let id = data.idSigno;
        let paciente = data.paciente;
        let fecha = data.fecha;
        let pulso = data.pulso;
        let temperatura = data.temperatura;
        let ritmoRespiratorio = data.ritmoRespiratorio;
        this.pacienteSeleccionado = data.paciente;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'paciente': new FormControl(paciente),
          'fecha': new FormControl(fecha),
          'pulso': new FormControl(pulso),
          'temperatura': new FormControl(temperatura),
          'ritmoRespiratorio': new FormControl(ritmoRespiratorio),
        });
      });
      
    }
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }    
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e:any){
    this.pacienteSeleccionado = e.option.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  get f() { return this.form.controls; }

  estadoBotonRegistrar() {
    return (this.pacienteSeleccionado === undefined);
  }
  

  aceptar(){
    
    let signo = new Signo();
    signo.idSigno = this.form.value['id'];
    signo.paciente = this.form.value['paciente'];
    signo.fecha = this.form.value['fecha'];
    signo.pulso = this.form.value['pulso'];
    signo.temperatura = this.form.value['temperatura'];
    signo.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];

    

    if (signo != null && signo.idSigno > 0 ) {
      //Modificar
      this.signoService.modificar(signo).pipe(switchMap(() => {
        return this.signoService.listarPageable(0, 10);
      })).subscribe(data => {                
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next("Se modificó");        
      });      
    }else{
      //Registrar  
      this.signoService.registrar(signo).pipe(switchMap(() => {
        return this.signoService.listarPageable(0,10);
      })).subscribe(data => {
        this.signoService.signoCambio.next(data);
        this.signoService.mensajeCambio.next("Se modificó");        
      });
    }
    
    setTimeout(() => {
      this.limpiarControles();
      this.router.navigate(['signo']);   
    }, 2000);

  }

  limpiarControles() {
    this.form.reset();
    this.pacienteSeleccionado = null;
    this.myControlPaciente.reset();
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';    
  }
}
