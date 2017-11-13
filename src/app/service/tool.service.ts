import { Injectable } from '@angular/core';
import { DeleteTool } from './toolbox/delete-tool.class';
import { DirectionsTool } from './toolbox/directions-tool.class';
import { ElevatorTool } from './toolbox/elevator-tool.class';
import { Mouse } from './toolbox/mouse.class';
import { MoveTool } from './toolbox/move-tool.class';
import { PortalTool } from './toolbox/portal-tool.class';
import { SelectTool } from './toolbox/select-tool.class';
import { StairsTool } from './toolbox/stairs-tool.class';
import { Tool } from './toolbox/tool.class';
import { WallTool } from './toolbox/wall-tool.class';
import { ModelService } from './model.service';

@Injectable()
export class ToolService {

    public toolbox: Tool[] = [];
    public mouse: Mouse;

    public get selectedTool(): Tool {
        return this.mouse.tool;
    }


    constructor(private modelSvc: ModelService) {
        this.mouse = new Mouse(this.modelSvc);
        this.toolbox = [
            new MoveTool(this.mouse, this.modelSvc),
            new SelectTool(this.mouse, this.modelSvc),
            new DeleteTool(this.mouse, this.modelSvc),
            new WallTool(this.mouse, this.modelSvc),
            new PortalTool(this.mouse, this.modelSvc),
            new StairsTool(this.mouse, this.modelSvc),
            new ElevatorTool(this.mouse, this.modelSvc),
            new DirectionsTool(this.mouse, this.modelSvc)
        ];
        this.selectTool(this.toolbox[0].name);
    }


    selectTool(name: string) {
        this.mouse.tool = this.toolbox.find(tool => tool.name === name) || null;
    }

}
