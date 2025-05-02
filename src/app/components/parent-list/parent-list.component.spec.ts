import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentListComponent } from './parent-list.component';

describe('ParentListComponent', () => {
  let component: ParentListComponent;
  let fixture: ComponentFixture<ParentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentListComponent]
    });
    fixture = TestBed.createComponent(ParentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
