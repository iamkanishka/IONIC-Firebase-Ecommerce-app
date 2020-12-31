import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceordPage } from './placeord.page';

describe('PlaceordPage', () => {
  let component: PlaceordPage;
  let fixture: ComponentFixture<PlaceordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
