function CountingSort(A, B, k) {
    let C = [];
    for(let i = 0; i <= k; i++) C[i] = 0;   //O(k)
    for(let j = 0; j < A.length; j++) C[A[j]] += 1; //O(n)
    let j = 0;
    for(let z = 0; z <= k; z++){    //O(n) -> il nr. di scritture su B e' per 'n' volte
        for(let v = 0; v < C[z]; v++){
            B[j] = z;
            j++;
        }
    }
}