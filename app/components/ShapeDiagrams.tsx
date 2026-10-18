import React from 'react';

export const SlabDiagram: React.FC = () => {
  return (
    <svg
      viewBox="0 0 180 120"
      width="100%"
      height="100%"
      style={{ maxWidth: '170px', maxHeight: '110px' }}
      aria-label="Slab, footing or wall diagram"
    >
      {/* 3D Box wireframe */}
      <polygon
        points="25,48 78,22 138,22 85,48"
        fill="var(--surface-sunken)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="25,48 85,48 85,78 25,78"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="85,48 138,22 138,52 85,78"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Hidden edges (dashed) */}
      <line
        x1="25"
        y1="78"
        x2="78"
        y2="52"
        stroke="var(--muted)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <line
        x1="78"
        y1="52"
        x2="138"
        y2="52"
        stroke="var(--muted)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <line
        x1="78"
        y1="22"
        x2="78"
        y2="52"
        stroke="var(--muted)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Blue Dimension: Length l */}
      <line
        x1="25"
        y1="88"
        x2="85"
        y2="88"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <path d="M 27 88 L 32 85 L 32 91 Z" fill="var(--calc-blue)" />
      <path d="M 83 88 L 78 85 L 78 91 Z" fill="var(--calc-blue)" />
      <text
        x="55"
        y="102"
        fill="var(--calc-blue)"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
      >
        l
      </text>

      {/* Blue Dimension: Width w */}
      <line
        x1="94"
        y1="80"
        x2="147"
        y2="54"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <path d="M 96 79 L 98 73 L 102 78 Z" fill="var(--calc-blue)" />
      <path d="M 145 55 L 143 61 L 139 56 Z" fill="var(--calc-blue)" />
      <text
        x="127"
        y="78"
        fill="var(--calc-blue)"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
      >
        w
      </text>

      {/* Blue Dimension: Height h */}
      <line
        x1="148"
        y1="22"
        x2="148"
        y2="52"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <path d="M 148 24 L 145 29 L 151 29 Z" fill="var(--calc-blue)" />
      <path d="M 148 50 L 145 45 L 151 45 Z" fill="var(--calc-blue)" />
      <text
        x="160"
        y="41"
        fill="var(--calc-blue)"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
      >
        h
      </text>
    </svg>
  );
};

export const ColumnDiagram: React.FC = () => {
  return (
    <svg
      viewBox="0 0 170 120"
      width="100%"
      height="100%"
      style={{ maxWidth: '160px', maxHeight: '110px' }}
      aria-label="Hole, column, or round footing diagram"
    >
      {/* Cylinder body */}
      <path
        d="M 25 35 L 25 75 A 50 18 0 0 0 125 75 L 125 35"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
      />
      {/* Top ellipse */}
      <ellipse
        cx="75"
        cy="35"
        rx="50"
        ry="18"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
      />
      {/* Dashed back ellipse at bottom */}
      <path
        d="M 25 75 A 50 18 0 0 1 125 75"
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Blue Dimension: Diameter d */}
      <line
        x1="28"
        y1="35"
        x2="122"
        y2="35"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <path d="M 30 35 L 36 32 L 36 38 Z" fill="var(--calc-blue)" />
      <path d="M 120 35 L 114 32 L 114 38 Z" fill="var(--calc-blue)" />
      <text
        x="75"
        y="27"
        fill="var(--calc-blue)"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
      >
        d
      </text>

      {/* Blue Dimension: Height h */}
      <line
        x1="135"
        y1="35"
        x2="135"
        y2="75"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <path d="M 135 37 L 132 43 L 138 43 Z" fill="var(--calc-blue)" />
      <path d="M 135 73 L 132 67 L 138 67 Z" fill="var(--calc-blue)" />
      <text
        x="148"
        y="59"
        fill="var(--calc-blue)"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
      >
        h
      </text>
    </svg>
  );
};

export const TubeDiagram: React.FC = () => {
  return (
    <svg
      viewBox="0 0 180 130"
      width="100%"
      height="100%"
      style={{ maxWidth: '170px', maxHeight: '120px' }}
      aria-label="Circular slab or tube diagram"
    >
      {/* Outer Cylinder */}
      <path
        d="M 35 48 L 35 84 A 48 18 0 0 0 131 84 L 131 48"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
      />
      {/* Outer top ellipse */}
      <ellipse
        cx="83"
        cy="48"
        rx="48"
        ry="18"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
      />
      {/* Inner hole ellipse */}
      <ellipse
        cx="83"
        cy="48"
        rx="26"
        ry="10"
        fill="var(--surface-sunken)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
      />
      {/* Hidden bottom inner lines */}
      <path
        d="M 57 84 A 26 10 0 0 0 109 84"
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Blue Dimension: Inner Diameter d2 (at top) */}
      <line
        x1="57"
        y1="20"
        x2="109"
        y2="20"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <line
        x1="57"
        y1="16"
        x2="57"
        y2="40"
        stroke="var(--calc-blue)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <line
        x1="109"
        y1="16"
        x2="109"
        y2="40"
        stroke="var(--calc-blue)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path d="M 59 20 L 65 17 L 65 23 Z" fill="var(--calc-blue)" />
      <path d="M 107 20 L 101 17 L 101 23 Z" fill="var(--calc-blue)" />
      <text
        x="83"
        y="16"
        fill="var(--calc-blue)"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
      >
        d2
      </text>

      {/* Blue Dimension: Outer Diameter d1 (at bottom) */}
      <line
        x1="35"
        y1="106"
        x2="131"
        y2="106"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <line
        x1="35"
        y1="84"
        x2="35"
        y2="110"
        stroke="var(--calc-blue)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <line
        x1="131"
        y1="84"
        x2="131"
        y2="110"
        stroke="var(--calc-blue)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path d="M 37 106 L 43 103 L 43 109 Z" fill="var(--calc-blue)" />
      <path d="M 129 106 L 123 103 L 123 109 Z" fill="var(--calc-blue)" />
      <text
        x="83"
        y="122"
        fill="var(--calc-blue)"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
      >
        d1
      </text>

      {/* Blue Dimension: Height h (on the left) */}
      <line
        x1="24"
        y1="48"
        x2="24"
        y2="84"
        stroke="var(--calc-blue)"
        strokeWidth="1.5"
      />
      <path d="M 24 50 L 21 56 L 27 56 Z" fill="var(--calc-blue)" />
      <path d="M 24 82 L 21 76 L 27 76 Z" fill="var(--calc-blue)" />
      <text
        x="14"
        y="70"
        fill="var(--calc-blue)"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
      >
        h
      </text>
    </svg>
  );
};

export const CurbDiagram: React.FC = () => {
  return (
    <svg
      viewBox="0 0 200 135"
      width="100%"
      height="100%"
      style={{ maxWidth: '190px', maxHeight: '125px' }}
      aria-label="Curb and gutter barrier diagram"
    >
      {/* Front L-shaped face */}
      <polygon
        points="30,42 56,42 56,76 100,76 100,92 30,92"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Top curb surface */}
      <polygon
        points="30,42 66,22 92,22 56,42"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Back extruded edges */}
      <polygon
        points="92,22 136,22 100,42 56,42"
        fill="var(--surface-sunken)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Gutter surface receding */}
      <polygon
        points="56,76 92,56 136,56 100,76"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Front edge flag thickness */}
      <polygon
        points="100,76 136,56 136,72 100,92"
        fill="var(--surface-sunken)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Blue Dimension: Curb Depth */}
      <line
        x1="30"
        y1="36"
        x2="56"
        y2="36"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 31 36 L 35 34 L 35 38 Z" fill="var(--calc-blue)" />
      <path d="M 55 36 L 51 34 L 51 38 Z" fill="var(--calc-blue)" />
      <text
        x="43"
        y="30"
        fill="var(--calc-blue)"
        fontSize="9.5"
        fontWeight="bold"
        textAnchor="middle"
      >
        Curb Depth
      </text>

      {/* Blue Dimension: Gutter Width */}
      <line
        x1="56"
        y1="36"
        x2="100"
        y2="36"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 57 36 L 61 34 L 61 38 Z" fill="var(--calc-blue)" />
      <path d="M 99 36 L 95 34 L 95 38 Z" fill="var(--calc-blue)" />
      <text
        x="78"
        y="30"
        fill="var(--calc-blue)"
        fontSize="9.5"
        fontWeight="bold"
        textAnchor="middle"
      >
        Gutter Width
      </text>

      {/* Blue Dimension: Curb Height */}
      <line
        x1="60"
        y1="42"
        x2="60"
        y2="76"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 60 43 L 58 47 L 62 47 Z" fill="var(--calc-blue)" />
      <path d="M 60 75 L 58 71 L 62 71 Z" fill="var(--calc-blue)" />
      <text x="75" y="62" fill="var(--calc-blue)" fontSize="9.5" fontWeight="bold">
        Curb Height
      </text>

      {/* Blue Dimension: Flag Thickness */}
      <line
        x1="142"
        y1="56"
        x2="142"
        y2="72"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 142 57 L 140 61 L 144 61 Z" fill="var(--calc-blue)" />
      <path d="M 142 71 L 140 67 L 144 67 Z" fill="var(--calc-blue)" />
      <text x="146" y="66" fill="var(--calc-blue)" fontSize="9" fontWeight="bold">
        Flag Thickness
      </text>

      {/* Blue Dimension: Length */}
      <line
        x1="97"
        y1="96"
        x2="133"
        y2="76"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 98 95 L 102 91 L 104 96 Z" fill="var(--calc-blue)" />
      <path d="M 132 77 L 128 81 L 126 76 Z" fill="var(--calc-blue)" />
      <text x="124" y="96" fill="var(--calc-blue)" fontSize="9.5" fontWeight="bold">
        Length
      </text>
    </svg>
  );
};

export const StairsDiagram: React.FC = () => {
  return (
    <svg
      viewBox="0 0 190 135"
      width="100%"
      height="100%"
      style={{ maxWidth: '185px', maxHeight: '130px' }}
      aria-label="Stairs concrete calculator diagram"
    >
      {/* Top platform */}
      <polygon
        points="30,30 52,18 80,18 58,30"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.5"
      />
      {/* Steps 5 down to 1 */}
      {/* Step 5 */}
      <polygon
        points="58,30 80,18 92,25 70,37"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      <polygon
        points="58,30 70,37 70,47 58,40"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      {/* Step 4 */}
      <polygon
        points="70,47 92,35 104,42 82,54"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      <polygon
        points="70,47 82,54 82,64 70,57"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      {/* Step 3 */}
      <polygon
        points="82,64 104,52 116,59 94,71"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      <polygon
        points="82,64 94,71 94,81 82,74"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      {/* Step 2 */}
      <polygon
        points="94,81 116,69 128,76 106,88"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      <polygon
        points="94,81 106,88 106,98 94,91"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      {/* Step 1 */}
      <polygon
        points="106,98 128,86 140,93 118,105"
        fill="var(--surface)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />
      <polygon
        points="106,98 118,105 118,115 106,108"
        fill="var(--surface-elevated)"
        stroke="var(--ink-secondary)"
        strokeWidth="1.2"
      />

      {/* Step numbers */}
      <text x="56" y="38" fontSize="8" fill="var(--muted)" fontWeight="bold">
        5
      </text>
      <text x="68" y="55" fontSize="8" fill="var(--muted)" fontWeight="bold">
        4
      </text>
      <text x="80" y="72" fontSize="8" fill="var(--muted)" fontWeight="bold">
        3
      </text>
      <text x="92" y="89" fontSize="8" fill="var(--muted)" fontWeight="bold">
        2
      </text>
      <text x="104" y="106" fontSize="8" fill="var(--muted)" fontWeight="bold">
        1
      </text>

      {/* Blue Dimension: Platform Depth */}
      <line
        x1="30"
        y1="24"
        x2="52"
        y2="12"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 31 23 L 36 21 L 34 26 Z" fill="var(--calc-blue)" />
      <path d="M 51 13 L 46 15 L 48 10 Z" fill="var(--calc-blue)" />
      <text
        x="44"
        y="10"
        fill="var(--calc-blue)"
        fontSize="8.5"
        fontWeight="bold"
        textAnchor="middle"
      >
        Platform Depth
      </text>

      {/* Blue Dimension: Run */}
      <line
        x1="84"
        y1="29"
        x2="96"
        y2="22"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 85 28 L 89 26 L 88 31 Z" fill="var(--calc-blue)" />
      <path d="M 95 23 L 91 25 L 92 20 Z" fill="var(--calc-blue)" />
      <text x="96" y="18" fill="var(--calc-blue)" fontSize="8.5" fontWeight="bold">
        Run
      </text>

      {/* Blue Dimension: Rise */}
      <line
        x1="120"
        y1="95"
        x2="120"
        y2="105"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 120 96 L 118 99 L 122 99 Z" fill="var(--calc-blue)" />
      <path d="M 120 104 L 118 101 L 122 101 Z" fill="var(--calc-blue)" />
      <text x="124" y="102" fill="var(--calc-blue)" fontSize="8.5" fontWeight="bold">
        Rise
      </text>

      {/* Blue Dimension: Width */}
      <line
        x1="120"
        y1="112"
        x2="142"
        y2="100"
        stroke="var(--calc-blue)"
        strokeWidth="1.2"
      />
      <path d="M 121 111 L 126 109 L 124 114 Z" fill="var(--calc-blue)" />
      <path d="M 141 101 L 136 103 L 138 98 Z" fill="var(--calc-blue)" />
      <text x="135" y="116" fill="var(--calc-blue)" fontSize="8.5" fontWeight="bold">
        Width
      </text>
    </svg>
  );
};
