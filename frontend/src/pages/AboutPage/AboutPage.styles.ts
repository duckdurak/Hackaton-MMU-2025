import styled from 'styled-components';

export const AboutImg = styled.img`
    @media (max-width: 1200px) {
    display: none;
  }
`

export const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0px 20px;
  line-height: 1.6;
  color: #333;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #8a4baf;
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.8rem;
  color: #6a3b8a;
  margin: 30px 0 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 20px 0 15px;
  }
`;

export const Text = styled.p`
  margin-bottom: 20px;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
`;

export const BenefitItem = styled.li`
  position: relative;
  padding-left: 35px;
  margin-bottom: 15px;
  font-size: 1.1rem;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #8a4baf;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding-left: 30px;
  }
`;

export const ContactInfo = styled.div`
  background: #f9f5ff;
  padding: 25px;
  border-radius: 10px;
  margin-top: 40px;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 30px;
  }
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ContactIcon = styled.span`
  margin-right: 10px;
  color: #8a4baf;
`;

