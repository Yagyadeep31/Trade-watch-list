import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeListComponent } from './trade-list.component';

describe('TradeListComponent', () => {
  let component: TradeListComponent;
  let fixture: ComponentFixture<TradeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
