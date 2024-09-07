import React, { useEffect, useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheck,FaExclamation, FaTimesCircle } from 'react-icons/fa';
import './verifyEmail.scss';


const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(10); 
    const navigate = useNavigate();

    const messages = {
        "1": "Usuário não encontrado.",
        "2": "Email já verificado.",
        "3": "Verificação inválida ou expirada.",
        "4": "E-mail verificado com sucesso."
    };

    const timeForPush = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 10000); 
    };

    const resendEmail = async () => {
        try {
            console.log("resendEmail")
            const res = await apiRequest(`/auth/resend-email?email=${emailParam}`);
            navigate('/');
        } catch (err) {
            console.error(err.response.data.message);
            setMessage(err.response.data.message);
        }
    }
    const verifyEmail = async () => {
        try {
            const res = await apiRequest(`/auth/verify-email?token=${tokenParam}`);
            setMessage(res.data.message);
            timeForPush('/login');
        } catch (err) {
          console.error(err.response.data.message);
            setMessage(err.response.data.message);
            switch (err.response.data.message) {
                case messages[1]:
                    timeForPush('/register');
                    break;
                case messages[2]:
                    timeForPush('/login');
                    break;
                case messages[3]:
                    timeForPush('/register');
                    break;
                default:
                    timeForPush('/login');
                    break;
            }
        }
    };

    useEffect(() => {
        verifyEmail();
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval); 
    }, []);

    return (
        <div>
            <div className='verify-email'>
            
                <p className={`top-msg`}>
                   {message} {message === messages[4] ? <FaCheck color='green'/> : <FaExclamation color='orange' /> }
                </p>
                {
                    message === messages["3"] && (
                        <div className='resend-email'>
                                <span> <a className='link-resendEmail' onClick={resendEmail}>Clique aqui</a> para reenviar o e-mail de verificação.</span>
                            </div>
                    )   
                }
                <p className='thx-verify'>
                    Obrigado por verificar seu e-mail. Você será redirecionado para a página de login em {countdown} segundos.
                </p>
                <div className="loader">
                    <label>Redirecionando... {countdown}</label>
                    <div className="loading"></div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
