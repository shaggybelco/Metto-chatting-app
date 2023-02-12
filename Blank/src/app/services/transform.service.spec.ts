import { TestBed } from '@angular/core/testing';

import { TransformService } from './transform.service';

describe('TransformService', () => {
  let service: TransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
