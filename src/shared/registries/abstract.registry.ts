import { Logger } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export interface IRegistryAddOptions {
  overrideExisting: boolean;
}
type IRegistryMap<T> = Record<string, T>;

export abstract class RegistryService<T = Record<string, unknown>> {
  protected state$: BehaviorSubject<IRegistryMap<T>> = new BehaviorSubject<
    IRegistryMap<T>
  >({});

  public stateChanged$: Observable<T[]> = this.state$
    .asObservable()
    .pipe(map(() => this.getItems()));

  private _stateVersion: string;
  /* Helper method for non-reactive usages */
  public get stateVersion(): string {
    return this._stateVersion;
  }

  private _isEmpty = true;
  public get isEmpty(): boolean {
    return this._isEmpty;
  }

  public constructor(private logger: Logger, private className?: string) {}

  public addItems(
    items: T[],
    options: IRegistryAddOptions = { overrideExisting: true },
  ): void {
    const storageValue: IRegistryMap<T> = this.state$.value;

    items.forEach((item: T) => {
      if (storageValue[this.getItemKey(item)] && !options.overrideExisting) {
        this.logger.warn(`Logger - ${
          this.className
        }: item with ${this.getItemKey(item)}
          is already registered. Skipping.`);

        return;
      }

      storageValue[this.getItemKey(item)] = { ...item };
    });

    this.state$.next(storageValue);

    if (items.length > 0) {
      this.updateStateFlags(false);
    }
  }

  public getItem(id: string): T | undefined {
    return this.state$.value[id];
  }

  public getItems(): T[] {
    return Object.values(this.state$.value);
  }

  public reset(): void {
    this.state$.next({});
    this.updateStateFlags(true);
  }

  public ngOnDestroy(): void {
    this.state$.complete();
  }

  protected abstract getItemKey(item: T): string;

  private updateStateFlags(isEmpty: boolean): void {
    this._isEmpty = isEmpty;
    this._stateVersion = uuidv4();
  }
}
