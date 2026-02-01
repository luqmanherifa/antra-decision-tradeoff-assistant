import { useState } from "react";
import { DIMENSIONS } from "../constants/dimensions";

export function useDecisionComparison() {
  const [decisionContext, setDecisionContext] = useState("");
  const [options, setOptions] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [constraints, setConstraints] = useState([]);
  const [viewMode, setViewMode] = useState("detail");
  const [isDecisionConfirmed, setIsDecisionConfirmed] = useState(false);

  const addConstraint = () => {
    setConstraints((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "soft",
        penalty: -10,
        checks: {},
      },
    ]);
  };

  const updateConstraint = (id, patch) => {
    setConstraints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const updateConstraintCheck = (constraintId, optionId, value) => {
    setConstraints((prev) =>
      prev.map((c) =>
        c.id === constraintId
          ? { ...c, checks: { ...c.checks, [optionId]: value } }
          : c,
      ),
    );
  };

  const removeConstraint = (id) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id));
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        impacts: [],
      },
    ]);
  };

  const updateOptionTitle = (id, title) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, title } : o)));
  };

  const removeOption = (id) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));

    setConstraints((prev) =>
      prev.map((c) => {
        const { [id]: removed, ...remainingChecks } = c.checks;
        return { ...c, checks: remainingChecks };
      }),
    );
  };

  const addImpact = (optionId) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? {
              ...o,
              impacts: [
                ...o.impacts,
                {
                  id: crypto.randomUUID(),
                  dimension: DIMENSIONS[0].key,
                  text: "",
                  value: 0,
                },
              ],
            }
          : o,
      ),
    );
  };

  const updateImpact = (optionId, impactId, patch) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? {
              ...o,
              impacts: o.impacts.map((i) =>
                i.id === impactId ? { ...i, ...patch } : i,
              ),
            }
          : o,
      ),
    );
  };

  const compare = () => {
    if (options.length < 2) return null;

    const totals = options.map((o) => {
      const impactTotal = o.impacts.reduce(
        (s, i) => s + Number(i.value || 0),
        0,
      );

      let constraintPenalty = 0;
      const violations = [];

      constraints.forEach((constraint) => {
        const isViolating = constraint.checks[o.id];
        if (isViolating === true) {
          if (constraint.type === "soft") {
            constraintPenalty += constraint.penalty;
          }
          violations.push({
            text: constraint.text,
            type: constraint.type,
            penalty: constraint.type === "soft" ? constraint.penalty : 0,
          });
        }
      });

      return {
        optionId: o.id,
        title: o.title,
        impactTotal,
        constraintPenalty,
        total: impactTotal + constraintPenalty,
        violations,
        isDisqualified: violations.some((v) => v.type === "hard"),
      };
    });

    const [a, b] = options;

    const allDims = new Set();
    options.forEach((opt) => {
      opt.impacts.forEach((i) => allDims.add(i.dimension));
    });

    const deltas =
      a && b
        ? [...allDims]
            .map((dim) => {
              const aVal = a.impacts
                .filter((i) => i.dimension === dim)
                .reduce((s, i) => s + Number(i.value || 0), 0);

              const bVal = b.impacts
                .filter((i) => i.dimension === dim)
                .reduce((s, i) => s + Number(i.value || 0), 0);

              return {
                dimension: dim,
                aVal,
                bVal,
                delta: bVal - aVal,
              };
            })
            .filter((d) => d.delta !== 0)
            .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))
        : [];

    return {
      totals,
      deltas,
      a,
      b,
    };
  };

  const getFilteredDeltas = () => {
    const result = compare();
    if (!result || !result.deltas) return [];

    let filtered = result.deltas;

    switch (filterMode) {
      case "positive":
        filtered = result.deltas.filter((d) => d.delta > 0);
        break;
      case "negative":
        filtered = result.deltas.filter((d) => d.delta < 0);
        break;
      default:
        filtered = result.deltas;
    }

    return filtered.slice(0, 3);
  };

  return {
    decisionContext,
    options,
    filterMode,
    constraints,
    viewMode,
    isDecisionConfirmed,

    setDecisionContext,
    setFilterMode,
    setViewMode,
    setIsDecisionConfirmed,

    addConstraint,
    updateConstraint,
    updateConstraintCheck,
    removeConstraint,
    addOption,
    updateOptionTitle,
    removeOption,
    addImpact,
    updateImpact,

    result: compare(),
    filteredDeltas: getFilteredDeltas(),
  };
}
