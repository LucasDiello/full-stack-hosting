import React, { useState } from 'react';
import './navbar.scss';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const user = true;  // Exemplo de usuário logado

    return (
        <nav>
            <ul className="left">
                <li href="/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>LDHomes</span>
                </li>
                <li href="/">Início</li>
                <li href="/">Sobre</li>
                <li href="/">Contato</li>
                <li href="/">Agentes</li>
            </ul>
            <div className="right">
                {user ? (
                    <div className="user">
                        <img
                            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt=""
                        />
                        <span>John Doe</span>
                        <Link to="/profile" className="profile">
                            <div className="notification">3</div>
                            <span>Perfil</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <a href="/" className='transition'>Entrar</a>
                        <a href="/" className="register transition">
                            Registrar-se
                        </a>
                    </>
                )}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <ul className={open ? "menu active" : "menu"}>
                    <li href="/">Início</li>
                    <li href="/">Sobre</li>
                    <li href="/">Contato</li>
                    <li href="/">Agentes</li>
                    <li href="/">Entrar</li>
                    <li href="/">Registrar-se</li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
