// This is magic.
// See https://stackoverflow.com/a/43834750/4464570 or https://stackoverflow.com/a/42988688/4464570

import * as workerPath from 'file-loader?name=[name].js!./graph-generator.worker';
import { Pathfinder2 } from '../pathlib/pathfinder2.class';
import { ModelService } from './model.service';
import { Injectable } from '@angular/core';


@Injectable()
export class WorkerService {
    private worker: Worker;

    constructor(private modelSvc: ModelService) {
        this.worker = new Worker(workerPath);
        console.log(workerPath, this.worker);
        this.worker.addEventListener('message', message => {
            console.log('listener:', message);
        });
    }


    public call(message) {
        console.log(this.modelSvc);
        //this.worker.postMessage(message, [JSON.stringify(this.modelSvc), this.onMapLoaded]);
    }

}
