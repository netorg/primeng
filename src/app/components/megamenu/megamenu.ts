import {NgModule,Component,ElementRef,Input,Renderer2,ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from 'primeng/dom';
import {MegaMenuItem,MenuItem} from 'primeng/api';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'p-megaMenu',
    template: `
        <div [class]="styleClass" [ngStyle]="style"
            [ngClass]="{'ui-megamenu ui-widget ui-widget-content ui-corner-all':true,'ui-megamenu-horizontal': orientation == 'horizontal','ui-megamenu-vertical': orientation == 'vertical'}">
            <ul class="ui-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="ui-menu-separator ui-widget-content" [ngClass]="{'ui-helper-hidden': category.visible === false}">
                    <li *ngIf="!category.separator" #item [ngClass]="{'ui-menuitem ui-corner-all':true,'ui-menuitem-active':item==activeItem, 'ui-helper-hidden': category.visible === false}"
                        (mouseenter)="onItemMouseEnter($event, item, category)" (mouseleave)="onItemMouseLeave($event, item)">
   
                        <a *ngIf="!category.routerLink" [href]="category.url||'#'" [attr.target]="category.target" [attr.title]="category.title" [attr.id]="category.id" (click)="itemClick($event, category)" [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{'ui-menuitem-link ui-corner-all':true,'ui-state-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass">
                            <span class="ui-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="ui-menuitem-text">{{category.label}}</span>
                            <span *ngIf="category.items" class="ui-submenu-icon pi pi-fw" [ngClass]="{'pi-caret-down':orientation=='horizontal','pi-caret-right':orientation=='vertical'}"></span>
                        </a>
                        <a *ngIf="category.routerLink" [routerLink]="category.routerLink" [queryParams]="category.queryParams" [routerLinkActive]="'ui-menuitem-link-active'" [routerLinkActiveOptions]="category.routerLinkActiveOptions||{exact:false}" [attr.tabindex]="category.tabindex ? category.tabindex : '0'" 
                            [attr.target]="category.target" [attr.title]="category.title" [attr.id]="category.id"
                            (click)="itemClick($event, category)" [ngClass]="{'ui-menuitem-link ui-corner-all':true,'ui-state-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass"
                            [fragment]="category.fragment" [queryParamsHandling]="category.queryParamsHandling" [preserveFragment]="category.preserveFragment" [skipLocationChange]="category.skipLocationChange" [replaceUrl]="category.replaceUrl" [state]="category.state">
                            <span class="ui-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="ui-menuitem-text">{{category.label}}</span>
                        </a>

                        <div class="ui-megamenu-panel ui-widget-content ui-corner-all ui-shadow" *ngIf="category.items">
                            <div class="ui-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="ui-megamenu-submenu" role="menu">
                                                <li class="ui-widget-header ui-megamenu-submenu-header ui-corner-all">{{submenu.label}}</li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="ui-menu-separator ui-widget-content" [ngClass]="{'ui-helper-hidden': item.visible === false}" role="separator">
                                                    <li *ngIf="!item.separator" class="ui-menuitem ui-corner-all" [ngClass]="{'ui-helper-hidden': item.visible === false}" role="none">
                                                        <a *ngIf="!item.routerLink" role="menuitem" [href]="item.url||'#'" class="ui-menuitem-link ui-corner-all" [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id" [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{'ui-state-disabled':item.disabled}" (click)="itemClick($event, item)">
                                                            <span class="ui-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="ui-menuitem-text">{{item.label}}</span>
                                                        </a>
                                                        <a *ngIf="item.routerLink" role="menuitem" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'ui-menuitem-link-active'" [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="ui-menuitem-link ui-corner-all" 
                                                             [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                                            [ngClass]="{'ui-state-disabled':item.disabled}" (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                                                            <span class="ui-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="ui-menuitem-text">{{item.label}}</span>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
                <li class="ui-menuitem ui-menuitem-custom ui-corner-all" *ngIf="orientation === 'horizontal'">
                    <ng-content></ng-content>
                </li>
            </ul>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MegaMenu {

    @Input() model: MegaMenuItem[];

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() orientation: string = 'horizontal';

    @Input() autoZIndex: boolean = true;

    @Input() baseZIndex: number = 0;
    
    activeItem: any;

    hideTimeout: any;
                
    constructor(public el: ElementRef, public renderer: Renderer2) {}
    
    onItemMouseEnter(event, item, menuitem: MegaMenuItem) {
        if (menuitem.disabled) {
            return;
        }

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        this.activeItem = item;

        if (menuitem.items) {
            let submenu = item.children[0].nextElementSibling;
            if (submenu) {
                if (this.autoZIndex) {
                    submenu.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }

                if (this.orientation === 'horizontal') {
                    submenu.style.top = DomHandler.getOuterHeight(item.children[0]) + 'px';
                    submenu.style.left = '0px';
                }
                else if (this.orientation === 'vertical') {
                    submenu.style.top = '0px';
                    submenu.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
                }
            }
        }
    }
    
    onItemMouseLeave(event, link) {
        this.hideTimeout = setTimeout(() => {
            this.activeItem = null;
        }, 1000);
    }
    
    itemClick(event, item: MenuItem | MegaMenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        
        if (!item.url) {
            event.preventDefault();
        }
        
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
                        
        this.activeItem = null;
    }
    
    getColumnClass(menuitem: MegaMenuItem) {
        let length = menuitem.items ? menuitem.items.length: 0;
        let columnClass;
        switch(length) {
            case 2:
                columnClass= 'ui-megamenu-col-6';
            break;
            
            case 3:
                columnClass= 'ui-megamenu-col-4';
            break;
            
            case 4:
                columnClass= 'ui-megamenu-col-3';
            break;
            
            case 6:
                columnClass= 'ui-megamenu-col-2';
            break;
                        
            default:
                columnClass= 'ui-megamenu-col-12';
            break;
        }
        
        return columnClass;
    }
}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [MegaMenu,RouterModule],
    declarations: [MegaMenu]
})
export class MegaMenuModule { }