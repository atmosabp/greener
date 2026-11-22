import { useEffect, useRef, useState } from "react";

/*

-> Devolve "true" enquanto o skeleton estaa na tela.
-> Tem um tempo mínimo de exibição, para não "piscar" quando a API responde rápido.
-> Ele foi criado para ser usado quando o <SkeletonBoundary> não encaixa (dentro de um <tbody>, onde um <div> seria inválido, por exemplo)
 
*/
export function useSkeleton(loading: boolean, minDuration = 400): boolean {
  const [show, setShow] = useState(loading);
  const startedAt = useRef(loading ? Date.now() : 0);

  useEffect(() => {
    if (loading) {
      startedAt.current = Date.now();
      setShow(true);
      return undefined;
    }
    const remaining = Math.max(0, minDuration - (Date.now() - startedAt.current));
    const t = setTimeout(() => setShow(false), remaining);
    return () => clearTimeout(t);
  }, [loading, minDuration]);

  return loading || show;
}