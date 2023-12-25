import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverModalComponent } from './popover-modal.component';

describe('PopoverModalComponent', () => {
  let component: PopoverModalComponent;
  let fixture: ComponentFixture<PopoverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
