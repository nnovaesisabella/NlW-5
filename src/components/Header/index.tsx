import styles from './styles.module.scss';
import formart from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR'

export function Header() {

    const currentDate = formart(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBr,
})

    
    return (
        <header className={styles.headerContainer}>
            <img src="./logo.svg" alt="PodCastr" />
            <p>O melhor para você ouvir sempre </p>
            <span>{currentDate}</span>
        </header> 
    )
}