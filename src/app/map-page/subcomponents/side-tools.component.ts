import { Component, OnInit } from '@angular/core';
import { ModelService } from '../../service/model.service';
import { ToolService } from '../../service/tool.service';
import { Tool } from '../../service/toolbox/tool.class';

@Component({
    selector: 'app-side-tools',
    templateUrl: './side-tools.component.html',
    styleUrls: ['./side-tools.component.css']
})
export class SideToolsComponent implements OnInit {

    public get tools(): Tool[] {
        return this.toolSvc.toolbox.filter(tool => tool.icon);
    }

    public get selectedTool(): Tool {
        return this.toolSvc.selectedTool;
    }


    constructor(private modelSvc: ModelService, private toolSvc: ToolService) {
    }

    ngOnInit() {
    }

    public selectTool(name: string) {
        this.toolSvc.selectTool(name);
    }

    public changeBackgroundImage(file: File) {
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.modelSvc.backgroundImageDataURL = reader.result;
            }, false);
            reader.readAsDataURL(file);
        }
    }
}
