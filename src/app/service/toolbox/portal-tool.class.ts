import { Point } from '../../model/point.class';
import { Portal } from '../../model/portal.class';
import { LineTool } from './line-tool.class';

export class PortalTool extends LineTool {

    public get name() {
        return 'Draw Portal';
    }

    public get icon() {
        return 'portal';
    }

    protected createLine(start: Point, end: Point) {
        const portal = new Portal('New Portal', start, end);
        this.floor.portals.push(portal);
        this.modelSvc.selectedObjects = [portal];
    }

}
