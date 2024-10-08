import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICourtType, NewCourtType } from '../court-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICourtType for edit and NewCourtTypeFormGroupInput for create.
 */
type CourtTypeFormGroupInput = ICourtType | PartialWithRequiredKeyOf<NewCourtType>;

type CourtTypeFormDefaults = Pick<NewCourtType, 'id'>;

type CourtTypeFormGroupContent = {
  id: FormControl<ICourtType['id'] | NewCourtType['id']>;
  typeName: FormControl<ICourtType['typeName']>;
  ballCourtID: FormControl<ICourtType['ballCourtID']>;
};

export type CourtTypeFormGroup = FormGroup<CourtTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CourtTypeFormService {
  createCourtTypeFormGroup(courtType: CourtTypeFormGroupInput = { id: null }): CourtTypeFormGroup {
    const courtTypeRawValue = {
      ...this.getFormDefaults(),
      ...courtType,
    };
    return new FormGroup<CourtTypeFormGroupContent>({
      id: new FormControl(
        { value: courtTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      typeName: new FormControl(courtTypeRawValue.typeName),
      ballCourtID: new FormControl(courtTypeRawValue.ballCourtID),
    });
  }

  getCourtType(form: CourtTypeFormGroup): ICourtType | NewCourtType {
    return form.getRawValue() as ICourtType | NewCourtType;
  }

  resetForm(form: CourtTypeFormGroup, courtType: CourtTypeFormGroupInput): void {
    const courtTypeRawValue = { ...this.getFormDefaults(), ...courtType };
    form.reset(
      {
        ...courtTypeRawValue,
        id: { value: courtTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CourtTypeFormDefaults {
    return {
      id: null,
    };
  }
}
