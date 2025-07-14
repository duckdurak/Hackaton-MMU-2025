import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #2a2a2a;
  color: #fff;
  padding: 40px 0;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const FooterSection = styled.div`
  h3 {
    color: #8a4baf;
    margin-bottom: 20px;
    font-size: 1.2rem;
    font-weight: 600;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: #ddd;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #8a4baf;
    }
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;

  a {
    color: #fff;
    font-size: 1.5rem;
    transition: color 0.3s;

    &:hover {
      color: #8a4baf;
    }
  }
`;

export const Copyright = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #444;
  color: #999;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;