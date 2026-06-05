import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatronesComponent } from './patrones.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('PatronesComponent', () => {
  let component: PatronesComponent;
  let fixture: ComponentFixture<PatronesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatronesComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(PatronesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
