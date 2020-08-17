import { Paciente } from './paciente';
export class Signo {
    idSigno: number;    
    paciente: Paciente;
    pulso: string ;
    fecha: string;
    ritmoRespiratorio: string;
    temperatura: string;
}