import { Request, Response } from "express";
import {Signal} from "../entity/Signal";
import {Vehicle} from "../entity/Vehicle";
import {Rental} from "../entity/Rental";
import {Tenant} from "../entity/Tenant";
import {User} from "../entity/User";




import { getManager } from "typeorm";



export const getSignal =  (req: Request, res: Response) => {

    Signal.findOne({idSignal: parseInt(req.params.idSignal)})
    .then(signal => {
        res.status(200).send(signal);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Signalement non trouvé"
            });                
        }
        return res.status(500).send({
            message: "Erreur Serveur"
        });
    });
}

export const addSignal = async (req: Request, res: Response) => {
    const signal = Signal.create({
        signalType: req.body.signalType,
        message: req.body.message,
        idUserSource: req.body.idUserSource,
        sourceType: req.body.sourceType,
        idVehicle: req.body.idVehicle,
        sent_at: req.body.sent_at,

        
    })

    await signal.save()
    res.status(200).send(signal)
}

export async function getSignals(_req: Request, res: Response) {
    const signals = await Signal.find();
    res.status(200).json(signals)
}


export const deleteSignal = async (req: Request, res: Response) => {
    Signal.delete({idSignal: parseInt(req.params.idSignal)})
    .then(() => {
        res.send({message: "Signalement supprimé avec succés!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Signalement non trouvé id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Erreur Serveur"
        });
    });

}
    //getSignals panne 
    export const getSignalPannesInformation = async (_req: Request, res: Response) => {
        try{
        var result={}
        var signalsNotTreated=[]
        var signalsTreated=[]
        var index1=0;
        var index2=0
        const signals = await Signal.find({signalType:"panne"});
        for(var i=0;i<signals.length;i++){
            
            const vehicle = await Vehicle.findOneOrFail({idVehicle:signals[i].idVehicle});
            const rental = await Rental.find({idVehicle:signals[i].idVehicle});
            const tenant = await Tenant.findOneOrFail({idTenant:rental[rental.length-1].idTenant});
            const user = await User.findOneOrFail({idUser:tenant.idUser});

            if(signals[i].treated){
            signalsTreated[index1]=Object.assign(signals[i],vehicle, rental[rental.length-1],user)
            index1++
            }else{
            signalsNotTreated[index2]=Object.assign(signals[i],vehicle, rental[rental.length-1],user)
            index2++
            }
        }
       result={
           signlasTreated: signalsTreated,
           signalsNotTreated:signalsNotTreated
       }
        res.status(200).json(result)
    }catch (err){
        console.log(err)
        res.status(500).json(err)

    }
    }

    export const getSignaTheftlInformation = async (_req: Request, res: Response) => {
        try{
        var result={}
        var signalsNotTreated=[]
        var signalsTreated=[]
        var index1=0;
        var index2=0
        const signals = await Signal.find({signalType:"theft"});
        for(var i=0;i<signals.length;i++){
            
            const vehicle = await Vehicle.findOneOrFail({idVehicle:signals[i].idVehicle});
            const rental = await Rental.find({idVehicle:signals[i].idVehicle});
            const tenant = await Tenant.findOneOrFail({idTenant:rental[rental.length-1].idTenant});
            const user = await User.findOneOrFail({idUser:tenant.idUser});

            if(signals[i].treated){
            signalsTreated[index1]=Object.assign(signals[i],vehicle, rental[rental.length-1],user)
            index1++
            }else{
            signalsNotTreated[index2]=Object.assign(signals[i],vehicle, rental[rental.length-1],user)
            index2++
            }
        }
       result={
           signlasTreated: signalsTreated,
           signalsNotTreated:signalsNotTreated
       }
        res.status(200).json(result)
    }catch (err){
        console.log(err)
        res.status(500).json(err)

    }
    }
 


