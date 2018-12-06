import React from 'react';

const alphabet = (props) => {
  return (
    <form>
      <label>First name starts with:</label>
      <ul id="alphabet">
        <li className={props.setStyle('A')} onClick={() => props.getStudents("A", "A")}>A</li>
        <li className={props.setStyle('B')} onClick={() => props.getStudents("B", "B")}>B</li>
        <li className={props.setStyle('C')} onClick={() => props.getStudents("C", "C")}>C</li>
        <li className={props.setStyle('D')} onClick={() => props.getStudents("D", "D")}>D</li>
        <li className={props.setStyle('E')} onClick={() => props.getStudents("E", "E")}>E</li>
        <li className={props.setStyle('F')} onClick={() => props.getStudents("F", "F")}>F</li>
        <li className={props.setStyle('G')} onClick={() => props.getStudents("G", "G")}>G</li>
        <li className={props.setStyle('H')} onClick={() => props.getStudents("H", "H")}>H</li>
        <li className={props.setStyle('I')} onClick={() => props.getStudents("I", "I")}>I</li>
        <li className={props.setStyle('J')} onClick={() => props.getStudents("J", "J")}>J</li>
        <li className={props.setStyle('K')} onClick={() => props.getStudents("K", "K")}>K</li>
        <li className={props.setStyle('L')} onClick={() => props.getStudents("L", "L")}>L</li>
        <li className={props.setStyle('M')} onClick={() => props.getStudents("M", "M")}>M</li>
        <li className={props.setStyle('N')} onClick={() => props.getStudents("N", "N")}>N</li>
        <li className={props.setStyle('O')} onClick={() => props.getStudents("O", "O")}>O</li>
        <li className={props.setStyle('P')} onClick={() => props.getStudents("P", "P")}>P</li>
        <li className={props.setStyle('Q')} onClick={() => props.getStudents("Q", "Q")}>Q</li>
        <li className={props.setStyle('R')} onClick={() => props.getStudents("R", "R")}>R</li>
        <li className={props.setStyle('S')} onClick={() => props.getStudents("S", "S")}>S</li>
        <li className={props.setStyle('T')} onClick={() => props.getStudents("T", "T")}>T</li>
        <li className={props.setStyle('U')} onClick={() => props.getStudents("U", "U")}>U</li>
        <li className={props.setStyle('V')} onClick={() => props.getStudents("V", "V")}>V</li>
        <li className={props.setStyle('W')} onClick={() => props.getStudents("W", "X")}>W/X</li>
        <li className={props.setStyle('Y')} onClick={() => props.getStudents("Y", "Z")}>Y/Z</li>
        <li className={props.setStyle('graduates')} onClick={props.getOldStudents}>Graduates</li>
        <li className={props.setStyle('unverified')} onClick={props.getUnverifiedStudents}>{props.numUnverified} Unverified</li>
      </ul>
    </form>
  )
};

export default alphabet;