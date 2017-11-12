// This is magic.
// See https://stackoverflow.com/a/43834750/4464570 or https://stackoverflow.com/a/42988688/4464570


import { ReflectiveInjector } from '@angular/core';
import { Pathfinder2 } from '../pathlib/pathfinder2.class';
import { ModelService } from './model.service';


function handleMessage(message: MessageEvent) {
    console.log('in webworker', message);

    const injector = ReflectiveInjector.resolveAndCreate([ModelService]);
    const modelSvc = injector.get(ModelService);

    const response = this.onMapLoaded(modelSvc);
    postMessage('this is the response ' + message.data, 'my worker', [response]);

}

addEventListener('message', handleMessage);


function onMapLoaded(modelSvc: ModelService) {
    console.log('building route graph...');
    // initialize connection graphs for pathfinding - function moved from DirectionsTool

    // create the basic nodegraph on each floor, and insert the static elevators and stairs
    for (const f of modelSvc.currentMap.floors) {

        // you can set smooth to true. This will result in a bit smoother paths,
        // but also (in the worst case) in twice as much nodes and therefore quadratic more calculation cost!
        f.floorGraph = Pathfinder2.createLinkedFloorGraph([...f.walls], 45, false);
        Pathfinder2.insertPointsToFloorGraph(f.stairways.map(el => el.center), f.floorGraph, f.walls);
    }

    Pathfinder2.generateTeleporterGraphOnMap(modelSvc.currentMap);

    for (const f of modelSvc.currentMap.floors) {
        f.floorGraph.paths = [];
    }

    console.log('done!', modelSvc.currentMap);
}
