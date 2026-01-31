import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header';

describe('Header', () => {
  let component: Headers;
  let fixture: ComponentFixture<Headers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Headers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Headers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
