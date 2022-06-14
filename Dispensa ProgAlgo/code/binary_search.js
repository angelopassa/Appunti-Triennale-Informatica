function Ricerca_Binaria(A, k, sx, dx) {
    if(sx > dx) return -1;
    c = (sx + dx) / 2;
    if(A[c] == k) return c;
    if(k < A[c]) Ricerca_Binaria(A, k, sx, c - 1);
    else Ricerca_Binaria(A, k, c + 1, dx);
}