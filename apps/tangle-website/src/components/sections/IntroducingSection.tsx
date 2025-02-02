import {
  SectionDescription,
  SectionHeader,
  SectionTitle,
  IntroducingTangleSvg,
} from '..';

export const IntroducingSection = () => {
  return (
    <section className="md:gap-[72px] md:pb-[60px] bg-introduction_section">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 ">
        <div className="flex flex-col gap-4 items-center px-5 justify-center pt-[60px]">
          <div className="flex flex-col items-center gap-2">
            <SectionHeader>Introducing</SectionHeader>
            <SectionTitle>Tangle Network</SectionTitle>
          </div>
          <SectionDescription className="text-center lg:w-[60%]">
            The next-generation blockchain connecting cross-chain dApps with
            threshold signature scheme (TSS) governance system.
          </SectionDescription>
        </div>
        <div className="flex justify-center">
          <IntroducingTangleSvg />
        </div>
      </div>
    </section>
  );
};
