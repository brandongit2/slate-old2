import css from './Loading.scss';

export default function Loading() {
    return (
        <div className={css.loading}>
            <div className={css.spinner} style={{animation: `${css['spinner-animation']} 1s infinite linear`}} />
        </div>
    );
}
