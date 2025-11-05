import SRG_circle from '../assets/images/SRG_circle.png';
import loading from '../assets/images/loading.gif';

export const Preloader = ({

}) => {
    return (
        <div class="flex justify-center relative">
            <img className='absolute' src={SRG_circle} width="60" alt="Logo" style={{
                top: '10px'
            }} />
            <img src={loading} width="80" />
        </div>
    );
}